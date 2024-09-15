

export function formatPhoneNumber(value: string): string {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  }

  export const formatCNPJ = (value: any) => {
    return value
      .replace(/\D/g, '') // Remove todos os caracteres não numéricos
      .replace(/^(\d{2})(\d)/, '$1.$2') // Adiciona o ponto após os dois primeiros dígitos
      .replace(/\.(\d{3})(\d)/, '.$1.$2') // Adiciona o ponto após os três dígitos seguintes
      .replace(/\.(\d{3})(\d)/, '.$1/$2') // Adiciona a barra após os três dígitos seguintes
      .replace(/(\d{4})(\d)/, '$1-$2') // Adiciona o hífen após os quatro últimos dígitos
      .substring(0, 18); // Limita o comprimento
  };

  export const formatDate = (isoDateString: any) => {
    if (!isoDateString) return ""; // Retorna uma string vazia se a data não for fornecida

    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês é zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  };

  export function formatCPF(value: string): string {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return value;
  }

export default {formatPhoneNumber, formatCNPJ,formatDate,formatCPF}
