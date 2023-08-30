import Swal from "sweetalert2";
import "./style.css";
export default function confirmarDialog(
    onConfirm: any,
    titulo: string = "¿Desea borrar el registro?",
    textoBotonConfirmacion: string = "Borrar"
) {
    Swal.fire({
        title: titulo,
        confirmButtonText: textoBotonConfirmacion,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then(result => {
        if (result.isConfirmed) {
            onConfirm();
        }

        return result.isConfirmed;
    })

    return false;
}

export function errorDialog(titulo: string, content :string) {
    Swal.fire({
        title: titulo,
        html : content,
        icon: 'error',
        showCloseButton: true
    });
}

export function warningDialog(titulo: string, content :string) {
    Swal.fire({
        title: titulo,
        icon: 'warning',
        showCloseButton: true
    });
}

export function successDialog(titulo: string, content :string) {
    Swal.fire({
        title: titulo,
        icon: 'success',
        showCloseButton: true,
        html : content
    });
}

export function confirmarDialogText(
    onConfirm: any,
    titulo: string = "¿Desea borrar el registro?",
    Texto: string = "Información de eliminación",
    textoBotonConfirmacion: string = "Borrar"
) {
    Swal.fire({
        title: titulo,
        confirmButtonText: textoBotonConfirmacion,
        showCancelButton: true,
        input: "text",
        inputPlaceholder:"Ingrese la observación",
        inputValidator: result => {
            return new Promise((resolve) => {
                if (result == "" || result == undefined )
                    resolve("Debe ingresar una observación");
                else
                    resolve("");
              });
        },
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then(result => {
        if (result.isConfirmed) {
            onConfirm(result);
        }
        return result;
    })

    return false;
}
