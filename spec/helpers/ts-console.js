var TSConsoleReporter = require("jasmine-console-reporter");
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new TSConsoleReporter());
