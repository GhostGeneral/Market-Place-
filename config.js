var config = module.exports;

config.jwt = {
    secret: 'kulikuliNaDmA!nTh1ng'
}

var userRoles = config.userRoles = {
    super_admin: 1,
    internal_staff: 2,
    business: 3,
    customer: 4
}

config.accessLevels = {
    customer: userRoles.customer,
    business: userRoles.business,
    internal_staff: userRoles.internal_staff,
    super_admin: userRoles.super_admin
};