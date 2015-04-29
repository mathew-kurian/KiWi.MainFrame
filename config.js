var ShortId = require('shortid');

module.exports = {
    token_expiration_time: 45 * 60 * 1000, // 45 mins
    default_profile_picture: 'https://s-media-cache-ak0.pinimg.com/originals/28/c7/ad/28c7adffc9af705dcd8a8b77b1a9c0e8.jpg',
    registration_algorithm: 'aes-256-ctr',
    registration_symmetric_key: 'jkcm',
    registration_password: '123456',
    default_lock_name: "MyKiWi",
    default_client_id: "dev",
    max_sockets_per_token: 3,
    max_sockets_per_lock: 1,
    private_field_symmetric_key: ShortId.generate(),
    private_field_algorithm: 'aes-256-ctr',
    bounce_delay: 8000
};
