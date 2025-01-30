export const handleDownload = async (
  e: React.MouseEvent,
  imageUrl: string,
  filename: string
) => {
  e.stopPropagation();
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.jpg`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err) {
    console.error("Failed to download: ", err);
  }
};
