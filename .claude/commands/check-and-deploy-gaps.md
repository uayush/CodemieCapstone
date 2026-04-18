Check whether `Gaps/gaps.txt` has changed since the last deployment. If it has, trigger a full deploy. If not, do nothing.

## Step 1 — Read the current gaps file

Read `Gaps/gaps.txt`. If the file is empty or missing, stop silently — nothing to deploy.

## Step 2 — Read the last-deployed snapshot

Read `Gaps/.gaps_deployed` if it exists. This file stores the content that was last successfully deployed.

## Step 3 — Compare

Compare the contents of `gaps.txt` to `.gaps_deployed` (trim whitespace before comparing).

- **If they are identical:** Print "No changes in gaps.txt — skipping deployment." and stop.
- **If they differ (or `.gaps_deployed` does not exist):** Proceed to Step 4.

## Step 4 — Deploy

Invoke the deploy-from-gaps skill to implement, PR, merge, and restart:

> /deploy-from-gaps

## Step 5 — Save the snapshot

After the deploy completes successfully, write the current contents of `Gaps/gaps.txt` to `Gaps/.gaps_deployed` using the Write tool. This marks the deployed version so future runs can detect changes.
