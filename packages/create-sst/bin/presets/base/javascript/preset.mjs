import { extract, install, patch } from "create-sst";

export default [
<<<<<<< HEAD
	extract(),
	install({
		packages: ["sst@^2", "aws-cdk-lib@2.161.1", "constructs@10.3.0"],
		dev: true,
	}),
=======
  extract(),
  install({
    packages: ["sst@^2", "aws-cdk-lib@2.171.1", "constructs@10.3.0"],
    dev: true,
  }),
>>>>>>> 69a1f60c4c9cd0bbc9d1e7bd7d257e0e6ca09eff
];
