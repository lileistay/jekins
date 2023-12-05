//生成50位随机数
export function getrandom(){
    let str='';
    for (let i = 0; i < 50; i++) {
        str += Math.floor(Math.random() * 10)
      }
      return str
}