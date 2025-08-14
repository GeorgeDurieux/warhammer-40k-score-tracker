export const ERROR_MESSAGES: Record<string, string> = {
    AUTH_MISSING_FIELDS: "Please fill in all required fields.",
    AUTH_USER_EXISTS: "An account with this username already exists.",
    AUTH_REGISTER_ERROR: "Something went wrong during registration.",
    AUTH_INVALID_USERNAME: "Invalid username.",
    AUTH_INVALID_PASSWORD: "Invalid password.",
    AUTH_LOGIN_ERROR: "Unable to log in. Please try again.",

    ARMY_NOT_FOUND: "Army not found.",
    ARMY_FETCH_ERROR: "Could not load armies.",
    ARMY_CREATE_ERROR: "Failed to create army.",
    ARMY_UPDATE_ERROR: "Failed to update army.",
    ARMY_DELETE_ERROR: "Failed to delete army.",

    DETACHMENT_CREATE_ERROR: "Failed to create detachment.",
    DETACHMENT_FETCH_ERROR: "Could not load detachments.",
    DETACHMENT_NOT_FOUND: "Detachment not found.",
    DETACHMENT_RETRIEVE_ERROR: "Failed to retrieve detachment.",
    DETACHMENT_DELETE_ERROR: "Failed to delete detachment.",
    DETACHMENT_UPDATE_ERROR: "Failed to update detachment.",

    MATCH_CREATE_FAILED: "Failed to create match.",
    MATCH_FETCH_FAILED: "Could not load matches.",
    MATCH_NOT_FOUND: "Match not found.",
    MATCH_RETRIEVE_FAILED: "Failed to retrieve match.",
    MATCH_DELETE_FAILED: "Failed to delete match.",
    MATCH_UPDATE_FAILED: "Failed to update match."
}
