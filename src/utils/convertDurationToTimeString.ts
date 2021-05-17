export function convertDurationToTimeString(duration: number) {
    // recebo duration em segundos e quero em horas e arredondado para baixo
    const hours = Math.floor(duration / 3600);
    // % pega o resto 
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    //padStart caso seja apenas um número ele acrescenta o zero na formatação

    const timeString = [hours, minutes, seconds]
        .map(unit => String(unit).padStart(2,'0')) // unit são unidades, horas, minutos e segundos
        .join(':')

    return timeString;
}