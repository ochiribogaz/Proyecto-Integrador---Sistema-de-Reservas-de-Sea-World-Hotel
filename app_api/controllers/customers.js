const mongoose = require('mongoose');
const customers = mongoose.model('customer');


/* It creates a customer in the database. */
const createCustomer = (req, res) => {
    customers.create(
        {
            customerId: req.body.customerId,
            name: req.body.name,
            lastname: req.body.lastname,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            province: req.body.province
        },
        (err, customerResult) => {
        if (err) {
            return res
                .status(400)
                .json({'error':err});
        } else {
            return res
                .status(201)
                .json(customerResult);
        }
    });
}

/* It returns a list of customers from the database. */
const customerList = (req, res) => {
    customers
        .find()
        .exec((err,customerResult) =>{
            if(err){
                return res
                    .status(404)
                    .json({'error': err});
            }
            else if(!customerResult || customerResult.length == 0){
                return res
                    .status(404)
                    .json({'result':'No se han encontrado documentos en la colección clientes'});
            }
            res
                .status(200)
                .json(customerResult);
        });
};

/* It gets the customerid from the URL parameters, then it looks for the customer in the database and returns it. */
const readCustomer = (req, res) => {
    customers
        .findById(req.params.customerid) /* Getting the customerid from the URL parameters. */
        .exec((err,customerResult) =>{
            if(err){
                return res
                    .status(404)
                    .json({'error': err});
            }
            else if(!customerResult){
                return res
                    .status(404)
                    .json({'message':`No se ha encontrado el cliente con id ${req.params.customerid}`});
            }
            res
                .status(200)
                .json(customerResult);
        });
};

/* It takes the customerid from the request, finds the customer in the database, updates the customer's information, and returns a token */
const updateCustomer = (req, res) => {
    if (!req.params.customerid) {
        return res
            .status(404)
            .json({'message':'Id del Cliente no encontrado'});
    }
    customers
        .findById(req.params.customerid)
        .exec((err, customerResult) => {
            if (!customerResult) {
                return res
                    .status(404)
                    .json({'message':`No se ha encontrado el cliente con id ${req.params.customerid}`});
            } else if (err) {
                return res
                    .status(400)
                    .json({'error':err});
            }
            
            customerResult.customerId = req.body.customerId?req.body.customerId:customerResult.customerId;
            customerResult.name = req.body.name?req.body.name:customerResult.name;
            customerResult.lastname = req.body.lastname?req.body.lastname:customerResult.lastname;
            customerResult.phone = req.body.phone?req.body.phone:customerResult.phone;
            customerResult.email = req.body.email?req.body.email:customerResult.email;
            customerResult.address = req.body.address?req.body.address:customerResult.address;
            customerResult.province = req.body.province?req.body.province:customerResult.province;
            
            customerResult.save((err, customers) => {
                if (err) {
                    res
                        .status(404)
                        .json({'error':err});
                } else {
                    console.log(customerResult);
                    res
                        .status(200)
                        .json(customerResult);
                }
            })
        })
};


/* It deletes a customer from the database based on the customerid passed in the request. */
const deleteCustomer = (req, res) => {
    if(!req.params.customerid){
        return res
            .status(404)
            .json({'message':'Id del Cliente no encontrado'});
    }
    customers
        .deleteOne({"_id": req.params.customerid})
        .exec((err, customerResult) => {
            if (!customerResult) {
                return res
                    .status(404)
                    .json({'message': `No existe un cliente con id: ${req.params.customerid}`});
                }
            else if (err) {
                return res
                    .status(404)
                    .json({'error':err});
                }
            return res
                .status(204)
                .send();
    });
};


module.exports = {
    customerList,
    createCustomer,
    readCustomer,
    updateCustomer,
    deleteCustomer
}