
const table_converter = (selector,collection_pname,collection_sname) => {
    $(() => {
        $(selector).DataTable({
            responsive: true,
            colReorder: {
                fixedColumnsRight: 2
            },
            columnDefs: [
                { responsivePriority: 1, targets: 0 },
                { responsivePriority: 2, orderable: false, targets: -1 },
                { responsivePriority: 2, orderable: false, targets: -2 },
            ],
            "language": {
                "lengthMenu": `Mostrando _MENU_ ${collection_pname}`,
                "info": `Mostrando de _START_ a _END_ de _TOTAL_ ${collection_pname}`,
                "infoEmpty": `Mostrando 0 a 0 de 0 ${collection_pname}`,
                "infoFiltered": `(filtrado de un total de _MAX_ ${collection_pname})`,
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "zeroRecords": `No se ha encontrado un ${collection_sname} coincidente`,
                "search": "Buscar:",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }
        });
    });
    console.log('Creating DataTable');
    console.log(DataTable.tables( { visible: true, api: true } ));
};

const table_reset = () => {
    console.log('Reloading table');
    DataTable.tables( { visible: true, api: true } ).clear();
}

const table_draw = () => {
    console.log('Drawing table');
    DataTable.tables( { visible: true, api: true } ).draw();
}