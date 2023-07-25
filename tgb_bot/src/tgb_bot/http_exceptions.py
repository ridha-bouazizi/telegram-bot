from werkzeug.exceptions import HTTPException

class Custom302Exception(HTTPException):
    code = 302
    description = 'You have been redirected with a 302 status code!'