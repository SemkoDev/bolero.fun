# CarrIOTA Bolero

Bolero is a desktop application for various environments (Windows, Mac, Linux) to easily
run an IOTA full node.

## Table of contents

  * [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installing](#installing)
    * [Running](#running)
    * [Shutting Down](#shutting-down)
  * [Building Locally](#building-locally)
  * [FAQ](#faq)
  * [Contributing](#contributing)
    * [Donations](#donations)
    * [Running Bolero](#running-bolero)
  * [Authors](#authors)
  * [License](#license)

## Getting Started

These instructions will get you a copy of this project running on your machine.

### Prerequisites

You need Java to have installed on your machine. 

**WINDOWS:** Please make sure you have the correct Java installed. Running 32bit Java on a 64bit machine
might crash IRI. If in doubt, install java from here, selecting correct bit version (32 or 64) depending
on your machine: ﻿https://www.java.com/en/download/manual.jsp

**WINDOWS:** Download and install the latest Visual C++ redistributable from here: https://download.visualstudio.microsoft.com/download/pr/11100230/15ccb3f02745c7b206ad10373cbca89b/VC_redist.x64.exe

#### Port Forwarding

You also need to open ports (port forwarding) in your NAT Router:

* **UDP 14600**
* **TCP 15600**
* **TCP 16600**
* **TCP 21310**

Please refer to your Router's manual on how to do that.

Furthermore, if you launch your node at home, please be aware that apart of firewall and port-forwarding in
your router, your Internet provider may also be an issue. Some providers (like Vodafone in Germany) do not have enough IPv4 addresses and
thus use something called "**IPv4 over DS Lite**". In those cases the **traffic will not come through** over the ports
mentioned above. Unfortunately, there is no quick fix for this issue (maybe changing providers).
There is some hope with the upcoming PCP-protocol, this will not happen this year (2018) for most providers, though.

### Installing

Download a package corresponding to your OS from releases, unpack, click the executable.
On Linux, you might need to start bolero.run from the command line.

### Running

There is not much to do here. This is still barebone. Just start the app.
Everything runs on default ports and cofigurations.

The app appears as a carrot symbol in your tray/task bar. The app interface is
launched within your default web browser. You can close the browser window and
the app will continue to run in the background until you click on exit in the
tray icon submenu.

First start might take a while, since Bolero downloads IRI (full node package)
and a snapshot of the database, which is over 5GB in size. So the first start
might take some time.

Once Bolero is running as is synced, you can use it as a full node for your
IOTA wallet with this address:

```
http://localhost:14265
```

### Shutting Down

Right click on the carrot in your tray/task bar and select "Exit".

## Building locally

```
npm install
npm run build

# Run development version
npm run dev

# Package binaries
npm run package
```

## FAQ

### How to upgrade?

Shut down Bolero, download the new version. Start it. Database and snapshots are preserved.

### Where is the database located?

In the User's home directory in a folder called ```.bolero```

### It takes very long to get synced

The longer you have been offline (not running Bolero), the longer it takes.
Also, make sure that your ports are open (refer to the prerequisites instructions above.)

### I am getting IRI error with exit code 1 on Windows

Please make sure you have the correct Java installed. Running 32bit Java on a 64bit machine
might crash IRI. If in doubt, install java from here, selecting correct bit version (32 or 64) depending
on your machine: ﻿https://www.java.com/en/download/manual.jsp

Restart your computer to take effect.

Also, download and install the latest Visual C++ redistributable from here: https://download.visualstudio.microsoft.com/download/pr/11100230/15ccb3f02745c7b206ad10373cbca89b/VC_redist.x64.exe

### I am getting IRI error with exit code 4294967295

Please download Bolero 0.1.10 or above.

### What if I have more questions?

* Join ```#bolero``` channel on IOTA's slack!

## Contributing

### Donations

**Donations always welcome**:

```
YHZIJOENEFSDMZGZA9WOGFTRXOFPVFFCDEYEFHPUGKEUAOTTMVLPSSNZNHRJD99WAVESLFPSGLMTUEIBDZRKBKXWZD
```

### Running Bolero

THe longer your app is running, the better for the network. Contribute to IOTA
by running Bolero as much as you can!


## Authors

* **Roman Semko** - *SemkoDev* - (https://github.com/romansemko)


## Contributors

* **IRI Database** - Kindly provided by *IOTA Partners* (https://iota.partners)

## License

This project is licensed under the ICS License - see the [LICENSE.md](LICENSE.md) file for details

