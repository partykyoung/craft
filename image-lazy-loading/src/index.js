const LOADED_IMAGES = {};

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const cacheImage = LOADED_IMAGES[src];

    if (cacheImage) {
      resolve(cacheImage.url);

      return;
    }

    const image = new Image();

    if (image.decode) {
      image.src = src;
      image
        .decode()
        .then(() => {
          LOADED_IMAGES[src] = {
            image,
            url: image.src,
          };

          resolve(LOADED_IMAGES[src].url);
        })
        .catch((e) => {
          reject();
        });

      return;
    }

    image.onerror = () => {
      reject();
    };

    image.onload = () => {
      LOADED_IMAGES[src] = {
        image,
        url: image.src,
      };

      resolve(LOADED_IMAGES[src]);
    };
  });
}

async function generateMosaic(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  // const mosaic1 = (sampleAmount) => {
  //   return new Promise((resolve) => {
  //     const width = canvas.width;
  //     const height = canvas.height;
  //     const sampleSize = Math.round(width / sampleAmount);
  //     ctx.drawImage(image, 0, 0, width, height);
  //     const pixelArr = ctx.getImageData(0, 0, width, height).data;
  //     for (let y = 0; y < height; y += sampleSize) {
  //       for (let x = 0; x < width; x += sampleSize) {
  //         const p = (x + y * width) * 4;
  //         ctx.fillStyle =
  //           "rgba(" +
  //           pixelArr[p] +
  //           "," +
  //           pixelArr[p + 1] +
  //           "," +
  //           pixelArr[p + 2] +
  //           "," +
  //           pixelArr[p + 3] +
  //           ")";
  //         ctx.fillRect(x, y, sampleSize, sampleSize);
  //       }
  //     }
  //     resolve();
  //   });
  // };

  const mosaic2 = (blockSize) => {
    return new Promise((resolve) => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      for (let y = 0; y < height; y += blockSize) {
        for (let x = 0; x < width; x += blockSize) {
          // 각 블록의 색상을 추출
          const imageData = ctx.getImageData(x, y, blockSize, blockSize);
          let red = 0,
            green = 0,
            blue = 0;
          for (let i = 0; i < imageData.data.length; i += 4) {
            red += imageData.data[i];
            green += imageData.data[i + 1];
            blue += imageData.data[i + 2];
          }
          const pixelCount = imageData.data.length / 4;
          red = Math.floor(red / pixelCount);
          green = Math.floor(green / pixelCount);
          blue = Math.floor(blue / pixelCount);
          // 추출한 색상으로 블록을 채움
          ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
          ctx.fillRect(x, y, blockSize, blockSize);
        }
      }
      resolve();
    });
  };

  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.position = "absolute";
  canvas.style.left = "0";
  canvas.style.right = "0";
  canvas.style.bottom = "0";
  canvas.style.top = "0";
  img.parentNode.appendChild(canvas);

  const ITERATION_DELAY = 100;
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  // await mosaic1(8);
  await mosaic2(80);
  await delay(ITERATION_DELAY);
  // await mosaic1(16);
  await mosaic2(60);
  await delay(ITERATION_DELAY);
  // await mosaic1(32);
  await mosaic2(40);
  await delay(ITERATION_DELAY);
  // await mosaic1(48);
  await mosaic2(30);
  await delay(ITERATION_DELAY);
  // await mosaic1(96);
  await mosaic2(20);
  await delay(ITERATION_DELAY);
  // await mosaic1(128);
  await mosaic2(15);
  await delay(ITERATION_DELAY);
  // await mosaic1(250);
  await mosaic2(10);
  await delay(ITERATION_DELAY);
  // await mosaic1(512);
  await mosaic2(5);
  await delay(ITERATION_DELAY);
  img.parentNode.removeChild(canvas);
}

const targets = document.querySelectorAll(".image");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      const imgs = entry.target.getElementsByTagName("img");

      if (imgs.length > 0) {
        const [img] = imgs;

        const image = await loadImage(img.dataset.src);

        console.log(img.src, image);

        if (img.src !== image) {
          img.src = image;
        }

        await generateMosaic(img);
      }
    }
  });
});

targets.forEach((target) => {
  observer.observe(target);
});
