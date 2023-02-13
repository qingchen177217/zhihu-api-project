export function throttle(fn: Function, delay: number) {

    // let timer: any = null;

    // return function (this: any) {
    //     if (timer == null) {
    //         fn.apply(this, arguments);
    //         timer = setTimeout(function () {
    //             timer = null;
    //         }, delay);
    //     }
    // }
    let last:any, deferTimer:any
        return function (this:any,args?:any) {
            let that = this
            let _args = arguments
            let now = +new Date()
            if (last && now < last + delay) {
                clearTimeout(deferTimer)
                deferTimer = setTimeout(function () {
                    last = now
                    fn.apply(that, _args)
                }, delay)
            }else {
                last = now
                fn.apply(that,_args)
            }
        }
} 













