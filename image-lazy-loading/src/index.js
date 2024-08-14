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

  const mosaic1 = (sampleAmount) => {
    return new Promise((resolve) => {
      const width = canvas.width;
      const height = canvas.height;
      const sampleSize = Math.round(width / sampleAmount);

      ctx.drawImage(img, 0, 0, width, height);

      const pixelArr = ctx.getImageData(0, 0, width, height).data;

      for (let y = 0; y < height; y += sampleSize) {
        for (let x = 0; x < width; x += sampleSize) {
          const p = (x + y * width) * 4;
          ctx.fillStyle =
            "rgba(" +
            pixelArr[p] +
            "," +
            pixelArr[p + 1] +
            "," +
            pixelArr[p + 2] +
            "," +
            pixelArr[p + 3] +
            ")";
          ctx.fillRect(x, y, sampleSize, sampleSize);
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
  await mosaic1(8);

  await delay(ITERATION_DELAY);
  await mosaic1(16);

  await delay(ITERATION_DELAY);
  await mosaic1(32);

  await delay(ITERATION_DELAY);
  await mosaic1(48);

  await delay(ITERATION_DELAY);
  await mosaic1(96);

  await delay(ITERATION_DELAY);
  await mosaic1(128);

  await delay(ITERATION_DELAY);
  await mosaic1(250);

  await delay(ITERATION_DELAY);
  await mosaic1(512);

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
