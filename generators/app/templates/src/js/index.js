console.log('gulp log');

var a =()=>{
    console.log('a');
}
a()
var promise = ()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve('success')
        }, 1000);
    })
}
promise()