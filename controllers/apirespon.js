exports.respon200 = function (value) {
    var response = {
        status: 200,
        message: 'Succes Response',
        data: value,
    }

    return response;
}

exports.v2respon200 = function (req, res, value) {
    var response = {
        status: 200,
        message: 'Succes Response',
        data: value,
    }

    return res.status(200).json(response);
}

exports.respon400 = function (value) {
    var response = {
        status: 400,
        message: 'Bad Request',
        data: value,
    }

    return response;
}

exports.v2respon400 = function (req, res, value) {
    var response = {
        status: 400,
        message: 'Bad Request',
        data: value,
    }

    return res.status(400).json(response);
}

exports.respon404 = (req, res, value) => {
    var response = {
        status: 404,
        message: 'Not Found',
        data: value,
    }

    return res.status(404).json(response);
}

exports.respon401 = (req, res, value) => {
    var response = {
        status: 401,
        message: 'Not Found',
        data: value,
    }

    return res.status(401).json(response);
}

