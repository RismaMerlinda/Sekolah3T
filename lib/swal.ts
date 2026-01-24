import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showConfirm = async ({
    title = 'Apakah Anda yakin?',
    text = '',
    icon = 'warning' as 'warning' | 'error' | 'success' | 'info' | 'question',
    confirmButtonText = 'Ya, Lanjutkan',
    cancelButtonText = 'Batal',
    confirmButtonColor = '#1E8F86',
    cancelButtonColor = '#EF4444',
}: {
    title?: string;
    text?: string;
    icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
}) => {
    const result = await MySwal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor,
        cancelButtonColor,
        confirmButtonText,
        cancelButtonText,
        reverseButtons: true,
        customClass: {
            popup: 'rounded-[2rem] border-none shadow-2xl',
            confirmButton: 'rounded-xl px-6 py-2.5 font-bold text-sm transition-all hover:scale-105 active:scale-95',
            cancelButton: 'rounded-xl px-6 py-2.5 font-bold text-sm transition-all hover:scale-105 active:scale-95',
        },
    });

    return result.isConfirmed;
};

export const showAlert = async ({
    title,
    text = '',
    icon = 'success' as 'success' | 'error' | 'warning' | 'info' | 'question',
    confirmButtonText = 'OK',
    confirmButtonColor = '#1E8F86',
}: {
    title: string;
    text?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    confirmButtonText?: string;
    confirmButtonColor?: string;
}) => {
    return MySwal.fire({
        title,
        text,
        icon,
        confirmButtonColor,
        confirmButtonText,
        customClass: {
            popup: 'rounded-[2rem] border-none shadow-2xl',
            confirmButton: 'rounded-xl px-6 py-2.5 font-bold text-sm transition-all hover:scale-105 active:scale-95',
        },
    });
};

export default MySwal;
