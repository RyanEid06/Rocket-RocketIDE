# Get started with RocketIDE and the Rocket SDK

RocketIDE runs on Windows x64. Download **RocketIDE** and the **Windows x64 Rocket SDK** from the [website](https://ryaneid06.github.io/Rocket-RocketIDE/). The IDE installer includes its .NET runtime and debugger; the SDK is a separate download.

## Install and configure

1. Run the RocketIDE installer and open RocketIDE. For the Portable ZIP, extract every file and open `RocketIDE.exe`.
2. Extract the entire `Rocket-SDK-3.0.0-windows-x64.zip` into a folder you will keep, such as `Documents\Rocket\`. The extracted `Rocket-SDK-3.0.0-windows-x64` folder contains `bin`, `stage0`, and the other SDK directories. Keep them together.
3. In RocketIDE, choose **Tools > Rocket SDK Settings...**.
4. Beside **Rocket compiler**, click **Browse...**, open the extracted SDK's `bin` folder, and select **rocketc.exe**.
5. Beside **Language server**, click **Browse...**, open the same SDK's `bin` folder, and select **rocket-lsp.exe**. Leave **Program arguments** empty for your first program. The workspace build-output trust checkbox can stay unchecked for this downloaded SDK.
6. Click **Save**. These selections are saved for future launches.
7. Choose **Tools > Validate Rocket Environment**, then **View > Output**. Successful setup reports `Environment validation passed.` and lists the selected compiler and language-server paths. The compiler version is `rocketc 3.0.0`.

## Run your first program

1. Create a project folder you can write to, such as `Documents\Rocket Projects\Hello`.
2. In RocketIDE, choose **File > Open Folder...** and select it.
3. Choose **File > New File**, enter the following, and press **Ctrl+S** to save it as `hello.rocket` in that folder:

```rocket
fn main() -> Int:
    print("Hello from Rocket!")
    return 0
```

4. Choose **Build > Check Rocket Target**, then **Run > Run Rocket Target**. The program prints `Hello from Rocket!` in the output.
5. To try debugging, click the editor gutter beside the `print` line to set a breakpoint, then choose **Debug > Start / Continue** (**F5**).

## If setup needs attention

- **Compiler or language server not found:** return to SDK Settings and browse to the two executable files inside the extracted SDK's `bin` folder. If you cloned the Rocket consumer branch, first install Git LFS and run `git lfs pull` in the clone; its Windows tools are under `platforms\windows-x64\bin`.
- **Moved SDK or reinstalled IDE:** select the new paths and click Save again. Reinstallation preserves settings under `%LOCALAPPDATA%\RocketIDE`.
- **Missing stage-zero host or debug tooling:** download the current complete SDK and extract it into a new folder. `stage0` is a required runtime component for debugging and structured IDE commands; keep the matching host supplied in the archive.
- **Build cannot write an output file:** use a project folder you can write to and stop any previous run/debug session before retrying. Builds generate files under the project's `.rocketc` directory. Check **View > Output** for the exact error.

The language SDK also has Linux x64, Linux ARM64, and macOS ARM64 packages for use with other editors. Follow their included `INSTALL.md` for host prerequisites.
