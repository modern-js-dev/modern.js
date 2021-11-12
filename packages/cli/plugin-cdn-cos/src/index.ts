import path from 'path';
import { logger } from '@modern-js/utils';
import { createPlugin, useAppContext } from '@modern-js/core';
import COS from 'cos-nodejs-sdk-v5';
import walk from 'walk';
import mime from 'mime-types';

export default createPlugin(() => ({
  // eslint-disable-next-line max-statements
  async beforeDeploy() {
    console.info('');
    logger.info('Uploading resource to COS...');

    const secretId = process.env.CLOUD_SECRET_ID;
    const secretKey = process.env.CLOUD_SECRET_KEY;
    if (!secretId || !secretKey) {
      logger.warn(
        'Using Tencent must provide SecretId and SecretKey, visit xxx to see more information',
      );
      return;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { distDirectory } = useAppContext();

    const uploadDir = process.env.CLOUD_STATIC_DIR || 'static';
    const prefix = process.env.CLOUD_BUCKET_PATH || '';
    const bucket = process.env.CLOUD_BUCKET_NAME;
    const region =
      process.env.CLOUD_BUCKET_REGION || process.env.REGION || 'ap-guangzhou';

    if (!bucket) {
      logger.warn('Uploading to Tencent COS must provider bucket name');
      return;
    }

    const cosClient = new COS({
      SecretId: secretId,
      SecretKey: secretKey,
    });

    const uploadRoot = path.join(distDirectory, uploadDir);
    const fl: string[] = [];
    walk.walkSync(uploadRoot, {
      listeners: {
        file: (root, stats, next) => {
          if (path.extname(stats.name) === '.map') {
            return next();
          }
          fl.push(path.join(root, stats.name));
          return next();
        },
      },
    });

    const uploadPromise = fl.map(filepath => {
      const uploadPath = path.relative(distDirectory, filepath);
      return new Promise((resolve, reject) => {
        cosClient.uploadFile(
          {
            Bucket: bucket,
            Region: region,
            Key: path.join(prefix, uploadPath),
            ContentType:
              mime.contentType(path.basename(uploadPath)) ||
              'text/plain; charset=utf-8',
            ContentDisposition: 'inline',
            FilePath: filepath,
            onFileFinish() {
              logger.info(`Upload ${uploadPath} success`);
            },
          },
          (err, data) => {
            if (err) {
              return reject(err);
            }
            return resolve(data);
          },
        );
      });
    });

    await Promise.all(uploadPromise);
    logger.info('Upload files to COS success');
  },
}));
