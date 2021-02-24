import {
  readAndDecryptFile as readAndDecryptFile,
  encryptAndSave,
} from "../src/main/crypto";
import * as path from "path";
import { file } from "tmp-promise";

const password = "V9cL^S*gzEy^";

test("should read encrypted file", async () => {
  const result = await readAndDecryptFile(
    path.join(__dirname, "fixtures/data.json.enc"),
    password
  );
  expect(result).toMatchSnapshot();
});

test("should encrypt ans save file", async () => {
  const { path, cleanup } = await file();

  try {
    await encryptAndSave(
      path,
      JSON.stringify([
        {
          uuid: "6035133a9ebdc44d8b929034",
          guid: "d9f4d6ce-b29f-42ee-8183-f7101336e124",
          name: "Barker Cannon",
          email: "barkercannon.@genmex.org",
          phone: "+1 (825) 557-3341",
          address: "116 Madeline Court, Maybell, Idaho, 2548",
        },
      ]),
      password
    );
    const result = await readAndDecryptFile(path, password);
    expect(result).toMatchSnapshot();
  } finally {
    cleanup();
  }
});
