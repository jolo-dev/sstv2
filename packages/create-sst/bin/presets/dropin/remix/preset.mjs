import { append, extract, install, patch } from "create-sst";

export default [
<<<<<<< HEAD
	extract(),
	install({
		packages: ["sst@^2", "aws-cdk-lib@2.161.1", "constructs@10.3.0"],
		dev: true,
	}),
	patch({
		file: "package.json",
		operations: [
			{ op: "add", path: "/scripts/sst:deploy", value: "sst deploy" },
			{ op: "add", path: "/scripts/sst:dev", value: "sst dev" },
			{ op: "add", path: "/scripts/dev", value: "sst bind remix dev" },
		],
	}),
	append({
		file: ".gitignore",
		string: ["", "", "# sst", ".sst"].join("\n"),
	}),
=======
  extract(),
  install({
    packages: ["sst@^2", "aws-cdk-lib@2.171.1", "constructs@10.3.0"],
    dev: true,
  }),
  patch({
    file: "package.json",
    operations: [
      { op: "add", path: "/scripts/sst:deploy", value: "sst deploy" },
      { op: "add", path: "/scripts/sst:dev", value: "sst dev" },
      { op: "add", path: "/scripts/dev", value: "sst bind remix dev" },
    ],
  }),
  append({
    file: ".gitignore",
    string: ["", "", "# sst", ".sst"].join("\n"),
  }),
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff
];
