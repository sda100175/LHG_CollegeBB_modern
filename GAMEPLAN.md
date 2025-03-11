# Conversion of LHG CollegeBB to modern codebase

## Step 1: Converting Game Files

The first milestone of this project would be to have a converted game engine. For that, need to solve for the inputs first. The inputs to a single game
are pretty straightforward. First, you need the team data. Second, you need the game parameters. And everything after that is just game logic.

So the first thing I want to do is take the LHGCBB team data files and convert them to something readable (they are binary right now). This is probably
going to involve writing some QuickBasic code. What I basically want is a utility that can take a single team data file, suck it in, and output the
data in plain text. From there, I can script that data out into something more readable (like JSON). Then the game file for the new game becomes a fully
readable / editable JSON text file.

Jason said he was looking to use something like SQLlite for the program's data. That would certainly be do-able, it is just a matter of sucking up all 
the JSON team files (and, later, data like scheduling and conference) into database tables and using that as the core data source for the program.

## Step 2: Deciding on Program Architecture

To do this right, you want to be able to distribute the new application anywhere / everywhere:

- Desktop app for Windows, MacOS, Linux
- Mobile app for iOS and Android
- Web app that can run in a browser

Before even starting a new game engine, need to decide the best course of action for building the app.

I like the idea of using React or (better) StencilJS for building it. And I'm already familiar with the Electron app wrapper, so that handles desktop and 
web app use cases. Electron doesn't really work right for mobile though.

Flutter came up as one possible route, also React Native (+Electron), .NET MAUI, and Tauri.



