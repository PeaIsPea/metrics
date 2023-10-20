//Imports
import { Internal, is, toSchema } from "@engine/components/internal.ts"
import { cli as schema, load } from "@engine/config.ts"
import github from "y/@actions/github@5.1.1"
import { latest, version } from "@engine/version.ts"
import core from "y/@actions/core@1.10.1"
import { process } from "@engine/process.ts"
import { parse } from "std/flags/mod.ts"
import { cyan, gray } from "std/fmt/colors.ts"
import { env } from "@utils/io.ts"
import { compat } from "./compat.ts"

/** CLI */
class CLI extends Internal {
  /** Import meta */
  static readonly meta = import.meta

  /** Context */
  declare protected readonly context: is.infer<typeof schema>

  /** Constructor */
  constructor(context = {} as Record<PropertyKey, unknown>) {
    super(schema.parse(context))
  }

  /** Run metrics */
  async run() {
    this.log.info(`Metrics ${version}`)
    this.log.probe(github.context)
    this.log.probe(Deno.env.toObject())
    // GitHub action setup
    if ((env.actions) && (env.get("INPUTS"))) {
      const inputs = JSON.parse(env.get("INPUTS")!) as Record<PropertyKey, unknown>
      for (const [key, value] of Object.entries(inputs)) {
        env.set(`INPUT_${key.replace(/ /g, "_").toUpperCase()}`, `${value}`)
      }
      console.log(compat(inputs))
    }
    // Check for updates
    if (this.context.check_updates) {
      const upstream = await latest()
      if (version.number !== upstream) {
        core.info(`Version ${upstream} is available!`)
      }
    }
    //
    await process(this.context.config)
  }

  /** Metadata */
  protected get metadata() {
    return {
      inputs: toSchema(schema.omit({ config: true })),
    }
  }
}

// Entry point
if (import.meta.main) {
  const { _: [action = "help"], config } = parse(Deno.args)
  switch (action) {
    case "run": {
      await new CLI(await load(config)).run()
      break
    }
    case "version": {
      console.log(version)
      break
    }
    default:
      console.log(`Unknown action: ${action}`)
      /* falls through */
    case "help": {
      console.log([
        cyan(`Metrics ${version}`),
        "",
        "Usage is:",
        "  help               Show this help message",
        "  version            Show version number",
        "  run                Run metrics",
        gray("    --config <path>  Path to configuration file"),
        "",
      ].join("\n"))
    }
  }
}
