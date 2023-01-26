<script setup lang="ts">
import { init, useTexture, initImage } from '@/webglCore/init'
import { onMounted } from 'vue'
import { mat4 } from "gl-matrix";
import vertexShaderSource from "@/shader/vertexShader";
import fragShaderSource from "@/shader/fragShader";
import { ponsitions } from "@/cube/cube";


const goGl = async () => {
  let canvas = document.querySelector('canvas') as HTMLCanvasElement
  canvas.width = 400
  canvas.height = 400
  let gl = canvas.getContext('webgl') as WebGLRenderingContext
  /* 顶点着色器源码 */
  let program = init(gl, vertexShaderSource, fragShaderSource) as WebGLProgram

  let positionArrs = new Float32Array([
    ...ponsitions
  ])
  let buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  let a_position = gl.getAttribLocation(program, "a_position")
  gl.bufferData(gl.ARRAY_BUFFER, positionArrs, gl.STATIC_DRAW)
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, positionArrs.BYTES_PER_ELEMENT * 6, 0)
  gl.enableVertexAttribArray(a_position)

  let a_color = gl.getAttribLocation(program, "a_color")
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, positionArrs.BYTES_PER_ELEMENT * 6, positionArrs.BYTES_PER_ELEMENT * 3)
  gl.enableVertexAttribArray(a_color)

  gl.enable(gl.DEPTH_TEST)
  // 视图矩阵
  const view = mat4.create()
  // mat4.lookAt(out: 输出矩阵, eye: 眼睛位置, center: 看的位置中心, up: 正方向): mat4
  mat4.lookAt(view, [1, 0, 1], [0, 0, 0], [0, 1, 0]) // 只能看到z为 0 - 1 范围, 使用投影解决
  const u_mat_v = gl.getUniformLocation(program, 'u_mat_v')
  gl.uniformMatrix4fv(u_mat_v, false, view)

  // 创建透视矩阵
  const perspective = mat4.create()
  // 宽高比
  let aspect = canvas.width / canvas.height
  // mat4.perspective(out: 输出矩阵, fovy: 角度, aspect: 宽高比例, near: 近端面距离, far: 最远可视区域距离)
  mat4.perspective(perspective, 60 / 180 * Math.PI, aspect, 1, 10)
  const u_mat_p = gl.getUniformLocation(program, 'u_mat_p')
  gl.uniformMatrix4fv(u_mat_p, false, perspective)

  gl.clearColor(0.5, 0.5, 0.5, 1)  // 清空颜色 R G B A
  gl.clear(gl.COLOR_BUFFER_BIT)  // 确认清除
  for (let i = 0; i <= 24; i += 4) {
    gl.drawArrays(gl.TRIANGLE_FAN, i, 4)
  }
  let x = 0, y = 0, z = 1
  run()
  function run() {
    x = Math.sin(Date.now() / 1000) * 2
    y = Math.cos(Date.now() / 1000) * 2
    mat4.lookAt(view, [x, y, z], [0, 0, 0], [0, 1, 0])
    // 
    const u_mat_v = gl.getUniformLocation(program, 'u_mat_v')
    gl.uniformMatrix4fv(u_mat_v, false, view)

    gl.clearColor(0.5, 0.5, 0.5, 1)  // 清空颜色 R G B A
    gl.clear(gl.COLOR_BUFFER_BIT)  // 确认清除
    for (let i = 0; i <= 24; i += 4) {
      gl.drawArrays(gl.TRIANGLE_FAN, i, 4)
    }
    requestAnimationFrame(run)
  }

}









onMounted(() => {
  goGl()
})
</script>

<template>
  <canvas id="webgl"></canvas>
</template>

<style scoped>
:global(html),
:global(body),
:global(#app) {
  padding: 0;
  margin: 0;
  height: 100%;
}

#webgl {
  margin: 100px;
  width: 500px;
  height: 500px;
}
</style>
