async function initialize(imageSources) {
  const root = document.querySelector("#root");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let totalWidth = 0;

  const imageLoad = (imageSource) => {
    return new Promise((resolve) => {
      const image = new Image();

      image.onload = () => {
        const aspectRatio = image.width / image.height;
        const height = 162; // 높이 고정
        const width = height * aspectRatio; // 비율에 맞는 너비

        totalWidth += width;

        resolve({ image, width, height });
      };

      image.src = imageSource;
    });
  };

  const images = await Promise.all(imageSources.map((src) => imageLoad(src)));

  canvas.width = totalWidth + 32 * (images.length - 1);
  canvas.height = 162;

  let xOffset = 0;

  images.forEach(({ image, width, height }, index) => {
    ctx.drawImage(image, xOffset, 0, width, height);

    if (index < images.length - 1) {
      xOffset += width + 32;
    }
  });

  root.appendChild(canvas);
}

initialize([
  "../public/image1.jpg",
  "../public/image2.jpg",
  "../public/image3.jpg",
  "../public/image4.jpg",
  "../public/image5.jpg",
  "../public/image6.jpg",
]);
