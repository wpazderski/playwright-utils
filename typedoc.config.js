const packageVersion = process.env["PACKAGE_VERSION"];
if (packageVersion === undefined) {
    throw new Error("PACKAGE_VERSION environment variable is not set. Please set it before running the script.");
}

/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
    plugin: ["typedoc-github-theme"],
    entryPoints: ["src/"],
    entryPointStrategy: "expand",
    exclude: ["./src/webEnvExtensions/assertions/matchers/common.ts"],
    headings: {
        readme: false,
    },
    outputs: [
        {
            name: "html",
            path: `./docs/v${packageVersion}/`,
        },
    ],
    navigation: {
        includeCategories: true,
        includeGroups: false,
        includeFolders: true,
        compactFolders: false,
        excludeReferences: true,
    },
    validation: {
        notExported: true,
        invalidLink: true,
        rewrittenLink: true,
        notDocumented: true,
        unusedMergeModuleWith: true,
    },
    excludeInternal: true,
    intentionallyNotExported: [],
    intentionallyNotDocumented: [
        "webEnvExtensions/assertions/matchers/types.MatcherUtils.customTesters",
        "webEnvExtensions/assertions/matchers/types.MatcherUtils.dontThrow",
        "webEnvExtensions/assertions/matchers/types.MatcherUtils.equals",
        "webEnvExtensions/assertions/matchers/types.MatcherUtils.utils",
        "webEnvExtensions/assertions/matchers/types.MatcherUtils.utils.__type.iterableEquality",
        "webEnvExtensions/assertions/matchers/types.MatcherUtils.utils.__type.subsetEquality",
        "webEnvExtensions/assertions/matchers/types.MatcherState.assertionCalls",
        "webEnvExtensions/assertions/matchers/types.MatcherState.expectedAssertionsNumber",
        "webEnvExtensions/assertions/matchers/types.MatcherState.isExpectingAssertions",
        "webEnvExtensions/assertions/matchers/types.MatcherState.numPassingAsserts",
        "webEnvExtensions/assertions/matchers/types.MatcherState.suppressedErrors",
        "webEnvExtensions/assertions/matchers/types.MatcherState.currentConcurrentTestName",
        "webEnvExtensions/assertions/matchers/types.MatcherState.currentTestName",
        "webEnvExtensions/assertions/matchers/types.MatcherState.error",
        "webEnvExtensions/assertions/matchers/types.MatcherState.expand",
        "webEnvExtensions/assertions/matchers/types.MatcherState.expectedAssertionsNumberError",
        "webEnvExtensions/assertions/matchers/types.MatcherState.isExpectingAssertionsError",
        "webEnvExtensions/assertions/matchers/types.MatcherState.isNot",
        "webEnvExtensions/assertions/matchers/types.MatcherState.promise",
        "webEnvExtensions/assertions/matchers/types.MatcherState.testPath",
    ],
};

export default config;
