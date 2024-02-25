/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { CMBuildManager }       from "./cmbuild-core/cm.build-manager";
import ts                       from "rollup-plugin-ts";
import { TCMBuildModuleFormat } from "./cmbuild-core/types/cm.module-format.type";
import { CMBuildBundleOptions } from "./cmbuild-core/types/cm.build-bundle.options";

const buildManager = new CMBuildManager(
	{
		onStart  : (name) => console.log(`Starting build for ${ name }...`),
		onSuccess: (name) => console.log(`Successfully completed build for ${ name }.`),
		onFailure: (name, error) => console.error(`Build for ${ name } failed with error: ${ error.message }`),
	});


buildManager.addConfiguration(
	new CMBuildBundleOptions(
		{
			input  : 'linc.client-build.ts',
			plugins: [ ts() ],
		},
		{
			file  : 'client-bundle.js',
			format: TCMBuildModuleFormat.IIFE,
		}
	)
);


buildManager.addConfiguration(
	new CMBuildBundleOptions({
			input  : 'server.ts',
			plugins: [ ts() ],
		},
		{
			file  : 'server-bundle.js',
			format: TCMBuildModuleFormat.CommonJS,
		}
	)
);

//
// Execute the build process
//
buildManager.run().catch(error => {
	console.error('Global cmbuild-core process failed:', error)
});
