import Swal from "sweetalert2";
import { Content } from "../../layout/components/Content";
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

