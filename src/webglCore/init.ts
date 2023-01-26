/**
 *
 * @param gl WebGLRenderingContext 上下文
 * @param shaderType number 创建shader类型
 * @param source shader 源码
 * @returns shader 创建的着色器对象 || null
 */
function createShader(
  gl: WebGLRenderingContext,
  shaderType: number,
  source: string
) {
  /* 着色器对象 */
  const createdShader = gl.createShader(shaderType) as WebGLShader
  /* 引入着色器源码 */
  gl.shaderSource(createdShader, source)
  /* 编译 */
  gl.compileShader(createdShader)
  // 编译出现问题时 成功返回 true
  let compile = gl.getShaderParameter(createdShader, gl.COMPILE_STATUS)
  if (!compile) {
    // 获取错误
    let err = gl.getShaderInfoLog(createdShader)
    // 失败删除
    gl.deleteShader(createdShader)
    console.error(`compile err...\n`, err)
    return null
  }
  return createdShader
}
/**
 *
 * @param gl WebGLRenderingContext 上下文
 * @param verTexShader 顶点着色器对象
 * @param fragmentShader 片元着着色器对象
 * @returns program 程序对象 || null
 */
function createProgram(
  gl: WebGLRenderingContext,
  verTexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  // 创建程序对象program
  const program = gl.createProgram() as WebGLProgram
  if (!program) {
    return null
  }
  // 附着顶点着色器和片元着色器到program
  gl.attachShader(program, verTexShader)
  gl.attachShader(program, fragmentShader)

  // 链接 program
  gl.linkProgram(program)
  /* 检查链接结果  成功返回 true */
  let linkResult = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linkResult) {
    // 获取错误
    let err = gl.getProgramInfoLog(fragmentShader)
    // 失败删除
    gl.deleteProgram(program)
    gl.deleteShader(verTexShader)
    gl.deleteShader(fragmentShader)
    console.error(`link program err...\n`, err)
    return null
  }
  // 使用 program
  gl.useProgram(program)

  // 返回 程序对象
  return program
}
/**
 *
 * @param gl WebGLRenderingContext 上下文
 * @param vertexShaderSource 顶点着色器源码
 * @param fragmentShaderSource  片元着色器源码
 * @returns program 程序对象 || null
 */
function init(
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
) {
  /* 顶点着色器对象 */
  const verTexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
  ) as WebGLShader
  /* 片元着色器 */
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  ) as WebGLShader
  if (!verTexShader || !verTexShader) {
    return null
  }
  return createProgram(gl, verTexShader, fragmentShader)
}
/**
 * 使用贴图
 * @param gl WebGLRenderingContext
 * @param program WebGLProgram
 * @param sampler uniform sampler2D u_sampler; 的 u_sampler
 * @param image HTMLImageElement 图片对象
 * @param num 使用第几个单元
 * @returns true
 */
function useTexture(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  sampler: string,
  image: HTMLImageElement,
  num: number
) {
  const UV_Tex = gl.createTexture() // 创建 uv buffer 缓冲区
  // 获取 uniform sampler2D u_sampler;  变量
  const u_sampler = gl.getUniformLocation(program, sampler)
  if (!u_sampler) {
    console.error(`${sampler} 获取失败 !`)
    return
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  // 激活 Texture, gl.TEXTURE0 表示第几个单元上, 最低可以有8张
  gl.activeTexture(gl[`TEXTURE${num}`]) // "suppressImplicitAnyIndexErrors": true, tsconfig.js 加上 不加会报错
  // 绑定 buffer, (参数类型, 创建的buffer)
  gl.bindTexture(gl.TEXTURE_2D, UV_Tex)
  // 对贴图参数设置 (参数类型, 参数名称, 具体值)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  // /* 如果像素不是2的次幂 则要开启下面的设置 */
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  // 使用图片
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
  // 传递 sampler2D 指定哪个单元
  gl.uniform1i(u_sampler, num)
  return true
}
/**
 * 加载image 对象的方法 返回 成功 或失败的结果
 * @param images Array<string>, 图片地址
 * @returns Promise<(HTMLImageElement | ErrorConstructor)[], 成就返回 创建好的 image
 */
async function initImage(images: Array<string>) {
  let imgPremiss: Promise<HTMLImageElement | ErrorConstructor>[] = images.map(
    (v) => {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = v
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error(`${v}  加载失败 !`))
      })
    }
  )
  return Promise.all(imgPremiss)
}
export { init, useTexture, initImage }
