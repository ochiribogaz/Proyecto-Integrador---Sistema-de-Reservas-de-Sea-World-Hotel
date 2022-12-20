const amenities_select = () => {
    $("#amenities").select2({
        theme: "bootstrap-5",
        width: "resolve",
        dropdownParent: $("#am-container"),
        language: {
            noResults: () => {
                return 'La característica ingresada no está disponible';
            }
        },
        placeholder: "Seleccione las características de la habitación",
        allowClear: true
    });
}

const get_amenities = () => {
    return $("#amenities").select2('data').map(selection => selection.text);
}

const reset_amenities = () => {
    $('#amenities').val(null).trigger('change');
}

const customer_select = () => {
    $(() => {
        $("#customerid").select2({
            theme: "bootstrap-5",
            dropdownParent: $("#ci-container"),
            placeholder: 'Seleccione el cliente de la reserva',
            language: {
                noResults: function() {
                    return 'No se ha encontrado el cliente';
                }
            }
        });
    });
}

const reset_customer = () => {
    $('#customerid').val(null).trigger('change');
}

const get_customer = () => {
    return $("#customerid").select2('data')[0].id;
}


