import fs from 'fs-extra';

fs.copySync('src/common/mailer/templates', 'dist/common/mailer/templates');
