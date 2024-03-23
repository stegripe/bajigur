export default function GetMediaTypeFromBuffer(buffer: Buffer): string {
    let fileType = "";
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        fileType = "jpeg";
    } else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
        fileType = "gif";
    } else if (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
    ) {
        fileType = "png";
    } else if (
        buffer[0] === 0x52 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x46
    ) {
        fileType = "webp";
    } else if (
        buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x18 &&
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x69 &&
        buffer[9] === 0x73 &&
        buffer[10] === 0x6f &&
        buffer[11] === 0x6d
    ) {
        fileType = "mp4";
    } else if (
        buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x14 &&
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x71 &&
        buffer[9] === 0x74 &&
        buffer[10] === 0x20 &&
        buffer[11] === 0x20
    ) {
        fileType = "mov";
    } else if (
        buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x20 &&
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x6d &&
        buffer[9] === 0x70 &&
        buffer[10] === 0x34 &&
        buffer[11] === 0x32
    ) {
        fileType = "mp4";
    } else if (buffer[0] === 0x4d && buffer[1] === 0x34 && buffer[2] === 0x56) {
        fileType = "mp4";
    } else if (
        buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x1c &&
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x6d &&
        buffer[9] === 0x70 &&
        buffer[10] === 0x34 &&
        buffer[11] === 0x31
    ) {
        fileType = "mp4";
    } else if (
        buffer[0] === 0x66 &&
        buffer[1] === 0x74 &&
        buffer[2] === 0x79 &&
        buffer[3] === 0x70 &&
        buffer[4] === 0x33 &&
        buffer[5] === 0x67 &&
        buffer[6] === 0x70 &&
        buffer[7] === 0x35
    ) {
        fileType = "mp4";
    } else if (
        buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x18 &&
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x69 &&
        buffer[9] === 0x73 &&
        buffer[10] === 0x6f &&
        buffer[11] === 0x32
    ) {
        fileType = "mp4";
    } else if (
        buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x14 &&
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x69 &&
        buffer[9] === 0x73 &&
        buffer[10] === 0x6f &&
        buffer[11] === 0x6d
    ) {
        fileType = "mp4";
    } else if (
        buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x20 &&
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x69 &&
        buffer[9] === 0x73 &&
        buffer[10] === 0x6f &&
        buffer[11] === 0x32
    ) {
        fileType = "mp4";
    } else if (
        buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x1c &&
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x69 &&
        buffer[9] === 0x73 &&
        buffer[10] === 0x6f &&
        buffer[11] === 0x6d
    ) {
        fileType = "mp4";
    } else if (
        buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x14 &&
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x69 &&
        buffer[9] === 0x73 &&
        buffer[10] === 0x6f &&
        buffer[11] === 0x32
    ) {
        fileType = "mp4";
    } else if (
        buffer[0] === 0x00 &&
        buffer[1] === 0x00 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x20 &&
        buffer[4] === 0x66 &&
        buffer[5] === 0x74 &&
        buffer[6] === 0x79 &&
        buffer[7] === 0x70 &&
        buffer[8] === 0x69 &&
        buffer[9] === 0x73 &&
        buffer[10] === 0x6f &&
        buffer[11] === 0x6d
    ) {
        fileType = "mp4";
    } else {
        fileType = "mp4";
    }

    return fileType;
}
