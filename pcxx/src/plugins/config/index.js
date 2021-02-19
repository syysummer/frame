import developmentConfig from "./development.env";
import productionConfig from "./production.env";
import testingConfig from "./testing.env";

let config = {}
if (process.env.NODE_ENV === 'development') {
	//本地环境测试
    config = developmentConfig
    
} else if (process.env.VUE_APP_CURRENTMODE === 'prod') {
	//线上环境配置
    config = productionConfig
    
} else if (process.env.VUE_APP_CURRENTMODE === 'test') {
	//测试环境配置
    config = testingConfig

}

export default config;