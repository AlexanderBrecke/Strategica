const functionsMiddleware = {}



//---------------------------------------------------------------------FUNCTION STUFF------------------------------------------------------------------------


functionsMiddleware.isEmpty = (value) => {
    return (value == null || value.length === 0);
}

//-------------------------------------------------------------------------------------------------


module.exports = functionsMiddleware;