const { files, diagnostics } = await Deno.emit("./boot.ts", {
  bundle: "module",
});

console.log(files);
