import { mock, Status } from "@utils/testing.ts"
import { throws } from "@utils/errors.ts"

export default {
  "/octocat": mock({}, () => ({
    status: Status.OK,
    data: new TextEncoder().encode(`
      MMM.           .MMM
      MMMMMMMMMMMMMMMMMMM
      MMMMMMMMMMMMMMMMMMM      _________________________________________
     MMMMMMMMMMMMMMMMMMMMM    |                                         |
    MMMMMMMMMMMMMMMMMMMMMMM   | Anything added dilutes everything else. |
   MMMMMMMMMMMMMMMMMMMMMMMM   |_   _____________________________________|
   MMMM::- -:::::::- -::MMMM    |/
    MM~:~ 00~:::::~ 00~:~MM
.. MMMMM::.00:::+:::.00::MMMMM ..
     .MM::::: ._. :::::MM.
        MMMM;:::::;MMMM
 -MM        MMMMMMM
 ^  M+     MMMMMMMMM
     MMMMMMM MM MM MM
          MM MM MM MM
          MM MM MM MM
       .~~MM~MM~MM~MM~~.
    ~~~~MM:~MM~~~MM~:MM~~~~
   ~~~~~~==~==~~~==~==~~~~~~
    ~~~~~~==~==~==~==~~~~~~
        :~==~==~==~==~~`),
  })),
  "/zen": () => throws("Expected error"),
  "/rate_limit": mock({}, () => ({
    status: Status.OK,
    data: {
      resources: {
        core: { remaining: 0, limit: 0 },
        search: { remaining: 0, limit: 0 },
        graphql: { remaining: 0, limit: 0 },
        code_search: { remaining: 0, limit: 0 },
      },
    },
  })),
}
