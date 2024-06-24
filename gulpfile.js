import gulp from 'gulp';
import { cleanDev, htmlDev, sassDev, imagesDev, jsDev, serverDev, watchDev } from './gulp/dev.js';
import { cleanDocs, htmlDocs, sassDocs, imagesDocs, jsDocs, serverDocs } from './gulp/docs.js';

gulp.task(
  'default',
  gulp.series(
    cleanDev,
    gulp.parallel(htmlDev, sassDev, imagesDev, jsDev),
    gulp.parallel(watchDev, serverDev)
  )
);

gulp.task(
  'docs',
  gulp.series(
    cleanDocs,
    gulp.parallel(imagesDocs, htmlDocs, sassDocs, jsDocs),
    serverDocs
  )
);
