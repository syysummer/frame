import Vconsole from 'vconsole';
if (process.env.NODE_ENV === 'development') {
    //本地环境测试
    //vconsole调试窗口，线上环境严禁使用
    let vConsole = new Vconsole();
    //本地环境配置测试用户信息
} else if (process.env.NODE_ENV === 'testing') {
	//测试环境配置
    //vconsole调试窗口，线上环境严禁使用
    let vConsole = new Vconsole();
}