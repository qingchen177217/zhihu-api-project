import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
//按需引入element插件
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 引入插件，进行简化操作
import AutoImport from 'unplugin-auto-import/vite'


export default defineConfig(({mode})=>{
    // 获取当前环境的变量
    const env=loadEnv(mode,process.cwd())
    // 可以读取到当前.env的环境变量
    return{
      plugins:[vue(),
      AutoImport({
        resolvers:[ElementPlusResolver()],
        imports:['vue'],
        dts:'src/auto-import.d.ts'//声明文件
      }),
      Components({
        resolvers:[ElementPlusResolver()]
      })
    ],
    server:{
      proxy:{
        '/api':{//遇到api开头的请求，都将其代理到target对应的属性中去
           target:env.VITE_BASE_URL,
           changeOrigin:true,//允许跨域
           rewrite:(path)=>path.replace(/^\/api/,'')
        }
      },
      host:'0.0.0.0'
    }
     
    }
})