Read the file `Gaps/gaps.txt` from the project root, then pass its contents as the feature description to the deploy-feature agent.

## Step 1 — Read the gaps file

Read `Gaps/gaps.txt` using the Read tool. The file contains a description of features or improvements that need to be implemented.

If the file is empty or does not exist, stop and tell the user: "gaps.txt is empty or missing — please add a feature description to Gaps/gaps.txt before running this skill."

## Step 2 — Deploy the feature

Pass the full contents of `gaps.txt` as the argument to the deploy-feature agent:

> /deploy-feature <contents of gaps.txt>

The deploy-feature agent will handle implementation, PR creation, merging, and server restart end-to-end.
