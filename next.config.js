module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/feed',
                permanent: true,
            },
        ];
    },
};