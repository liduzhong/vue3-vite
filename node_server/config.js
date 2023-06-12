// 配置信息
const config = {
	// 服务端口
	port: 3000,
	// 数据库配置
	database: {
		database: 'node',
		user: 'root',
		password: '123456',
		host: 'localhost',
	},
	// 阿里云oss配置信息
	oss: {
		// 以华南3（广州）为例，region填写为oss-cn-guangzhou。
		region: 'oss-cn-hangzhou',
		// 填写AK和AS
		accessKeyId: 'LTAI5tNpFeWyvybtCAoNXKBy',
		accessKeySecret: 'VVPEsE9POX7iIe0XGH10iZB3I9AVfB',
		// 填写待配置跨域资源共享规则的Bucket名称。
		bucket: 'kendu',
	},
	// jwt配置信息
	jwt: {
		secretKey: 'this is a secret key',
		expires: '24h',
	},
}

module.exports = config
