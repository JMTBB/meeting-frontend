module.exports = {
    devServer : {
        proxy : {
            '/apis' : {
                target : 'http://localhost:8080/meetings/api',
                // ws : true,
                changeOrigin : true,
                pathRewrite : {
                    '^/apis' : ''
                }
            }
        }
    }
    
}