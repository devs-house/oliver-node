export const log = (title: string, info: string[]) => {
  if (process.env.NODE_ENV !== 'production') {
    // tslint:disable-next-line: no-console
    console.log(`\n----- ${title} -----\n\n${info.join('\n')}\n\n`);
  }
};
