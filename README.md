Line Bounce
===========

Greetings,

You have reached our awesome, new GitHub repo! In this README file, I will be describing what is, in my honest opinion, the best way to use Git that will avoid most of those nasty merge conflicts and to make it easy to see who wrote what code.

-Max

Git (a work in progress)
------------------------

###Getting Started###

So first, you're going to need to install Git. Google it. Install it. Done, moving on...

Once you've gotten Git installed, the first thing you're going to want to do is fork the Line Bounce repo. If you're reading this, you're most likely already looking at this repo, but just for reference, the address is: https://github.com/team-olympus/line-bounce. Now that you're looking at the repo, in the top-right corner there should be a button that says 'Fork'. Click it. You will be taken to a new page that looks eerily like the main repo page. Guess what? You now have your very own copy of our entire repo!

Next, you'll want to 'clone' our repo. To do this, you should clear some space out in your file system where this project is going to go. I recommend making an entire folder where you can store just this project. Then, pop into a shell and and execute:

```
cd /path/to/dir
git clone https://github.com/xxxxx/line-bounce <folder>
```

Where /path/to/dir is the path to the directory you just created, xxxxx is your GitHub username, and <folder> is the name of the sub-directory you want git to copy the files into. I *highly* recommend keeping one completely clean copy of the code that never gets edited, so for the purposes of this example make <folder> equal to 'clean'. If you don't want to type out that entire URL string, go to your fork (make sure it's yours, and not the team's/someone else's) and look in the right-hand column. There should be a field titled 'HTTPS clone URL' which has the entire URL string for you to copy and paste.

Plese not that from now on, you must ```cd``` into either the root directory or a sub-directory of the cloned repo (in this case 'clean') to be able to use ```git``` commands.

###Making Changes###

Next is the good part: make your changes to the files! You can add, delete, and edit files to ~~your~~ ASJ's heart's content. When you're ready, you can view an overview of the changes you made by typing ```git status``` into the console, or get full list of every line you changes with ```git diff```. Now you need to 'stage' these changes by entering ```git add /path/to/file``` for each file that you wish to commit your changes to. If you wish to commit all changes to all files that you made, you can just ```git add .```, but be *very* careful with this.

After you have stages all of your files for comitting, you need to actually commit them before you can push up to the web. The syntax is (quotes needed):

```git commit -m "title"```

Where title is what you want the title of your commit to be. Please, please, please give your commit's short but descriptive titles. Keeping commits small and isolated to a single change should make this fairly easy.

###Comitting Changes###

You're almost there! All that's left is to push you commit to your fork and merge it into the upstream repo. To push a bunch of commits, you should check and make sure that the 'remotes' (short for remote repository, i.e. the files on GitHub) are setup correctly. If you were following this guide, you would have cloned from your fork and your fork should be registered as 'origin'. You can verify this by executing ```git remote -v```. If the remote does not exist, you can add it with ```git remote add origin <github url>```. After you have verified that the remote is there, you can puch all of your local commits to your fork with ```git push origin <branch name>```. Since we haven't defined a 'branch' yet, <branch name> will be 'master'.

Now that your changes have been pushed to GitHub, you have to merge it into the upstream repo. All you have to do is go to the GitHub website and navigate to your forked repository, then click on the green 'Compare and Review' button to make a pull request. Once the pull request has been made, you will have to login as team-olympus (ask around for the password) and merge the pull request, which is relatively straightforward as long as GitHub tells you that the request can be automatically merged.

###Keeping Your Code Up-to-Date###

since you aren't the only one pushing code to the repo, you probably realized that you're going to need a way to aquire the changes that other people in the group made as well. Good news! The ```git push``` command has a brother, ```git pull``` and he does exactly the opposite! To pull updates from GitHub, you're going to need to add the main, team-olympus repo to your remotes. Just execute ```git remote add upstream https://github.com/team-olympus/line-bounce``` and you're done. To pull updates from GitHub into your local repo, you should make sure your 'working directory is clean' (i.e. you have no uncomitted changes) with ```git status```. If it is not, you can throw away specific changes with ```git checkout /path/to/file``` then commit, or just throw away all uncommitted changes with ```git checkout .```. Finally, once the working directory is clean, just ```git pull upstream master``` to grab the changes from the upstream repo.

###Dealing with Merge Conflicts###
Coming soon!
