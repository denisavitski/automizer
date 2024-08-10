export async function getBuffer(data: Buffer | File) {
  if (data instanceof Buffer) {
    return data
  }

  return Buffer.from(await data.arrayBuffer())
}
