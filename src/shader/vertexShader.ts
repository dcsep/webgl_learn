export default /* glsl */ `
  attribute vec3 a_position;
  attribute vec3 a_color;
  uniform mat4 u_mat_v;
  uniform mat4 u_mat_p;
  varying vec3 v_color;
  void main() {
    gl_PointSize = 10.0;
    v_color = a_color;
    gl_Position = u_mat_p * u_mat_v * vec4(a_position, 1.0);
  }
`
/**
 * 分号结尾, 区分大小写
 * 简单数据类型: int  float  bool
 * 变量声明: [数据类型] [变量名] = [值];
 * 1 不等于 1.0
 * 类型转换 类型(被转换的变量): float(int);
 * 计算: 类型必须一致
 * 复杂数据类型:
 *  向量: Vector =>  vec2 vec3 vec4
 *  矩阵: Matrix =>  mat2 mat3 mat4
 */

/**
 * if语句
 *   if(color1.x > 0.8){
 *      color1.x = 0.0;
 *    }
 */

/* for循环
  for(int i;i< 10; i++){
    ....
  })
*/

/* 
 函数
 [返回值类型] [函数名] (参数1, 参数2..){
  ...
 }
 float sum(x, y){
  return x + y;
 }

*/
