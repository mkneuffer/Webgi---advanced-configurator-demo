import { ViewerApp, AssetManagerPlugin, addBasePlugins, AssetManagerBasicPopupPlugin, VariationConfiguratorPlugin, ITexture } from "webgi";
async function setupViewer() {
  // Initialize the viewer
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas") as HTMLCanvasElement,
  });

  const manager = await viewer.addPlugin(AssetManagerPlugin);
  await viewer.addPlugin(AssetManagerBasicPopupPlugin);
  const config = await viewer.addPlugin(VariationConfiguratorPlugin);

  // Load scene settings
  manager.addFromPath("https://3dassetsmaan.s3.ap-south-1.amazonaws.com/VariationConfiguratorTutorials/3/box.glb");

  await addBasePlugins(viewer);
  viewer.renderer.refreshPipeline();

  await config.importPath("https://3dassetsmaan.s3.ap-south-1.amazonaws.com/VariationConfiguratorTutorials/3/config.json");

  // apply default variations
  config.applyVariation(config.variations.objects[0], 0, "objects");
  config.applyVariation(config.variations.objects[1], 0, "objects");
  config.applyVariation(config.variations.materials[3], 0, "materials");

  document.querySelectorAll(".objectVariation").forEach((el) => {
    el.addEventListener("click", () => {
      // make active in ui
      el.parentElement?.querySelectorAll(".objectVariation").forEach((el) => {
        el.classList.remove("objectActive");
      });
      el.classList.add("objectActive");

      // apply variation
      const category = config.variations.objects.find((cat) => cat.name === el.getAttribute("data-category"))!;
      const index = parseInt(el.getAttribute("data-index")!);
      const type = "objects";
      config.applyVariation(category, index, type);
    });
  });

  document.querySelectorAll(".material").forEach((el) => {
    el.addEventListener("click", async () => {
      // make active in ui
      el.parentElement?.querySelectorAll(".material").forEach((el) => {
        el.classList.remove("materialActive");
      });
      el.classList.add("materialActive");

      const catergory = el.getAttribute("data-category");
      if (catergory == "Diamond") {
        // apply materials for the box and diamond
        const mainDiamond = config.variations.materials.find((cat) => cat.name === "mainDiamond")!;
        const boxOut = config.variations.materials.find((cat) => cat.name === "boxOut")!;
        const boxIn = config.variations.materials.find((cat) => cat.name === "boxIn")!;
        const index0 = parseInt(el.getAttribute("data-index0")!);
        const index1 = parseInt(el.getAttribute("data-index1")!);
        const index2 = parseInt(el.getAttribute("data-index2")!);
        config.applyVariation(mainDiamond, index0, "materials");
        config.applyVariation(boxIn, index1, "materials");
        config.applyVariation(boxOut, index2, "materials");

        // apply background image
        let bg = await manager.importer!.importSinglePath<ITexture>(el.getAttribute("data-bg")!, { processImported: true });
        viewer.setBackground(bg!);
        viewer.backgroundIntensity = 0.3;
      } else if (catergory == "Metal") {
        //apply materials for the metal
        const Metal = config.variations.materials.find((cat) => cat.name === catergory)!;
        const index = parseInt(el.getAttribute("data-index")!);
        config.applyVariation(Metal, index, "materials");
      }
    });
  });
}

setupViewer();
