' Each Team record in BASK file is 655 bytes
Const TEAM_SIZE_BYTES = 655

' Each data record in COLBBTMS file is 574 bytes
Const DATA_SIZE_BYTES = 574

' Team data array 
Dim Shared teamData$(1000, 25)
Dim Shared playerData$(1000, 15, 15)
Dim Shared teamFieldIds$(25)
Dim Shared playerFieldIds$(15)

' Number of teams for this season
numberTeams = 0

' Main program 
Main 

' Exit program
System


' =====================================================================================================================
' Starting point for the program, takes the year entered and coordinates the process of conversion.
Sub Main
    ' Read in the team data for given year
    ReadTeamFile
    ReadExtrasFile
    
    ' Output the data into a JSON file
    WriteOutputFile 
End Sub

' =====================================================================================================================
' Sets the field index to string mappimgs
Sub SetTeamFieldIds
    teamFieldIds$(1) = "teamStamina"
    teamFieldIds$(2) = "defFGPctAdj"
    teamFieldIds$(3) = "def3FGAvFGAAdj"
    teamFieldIds$(4) = "def3FGPctAdj"
    teamFieldIds$(5) = "offStealRating"
    teamFieldIds$(6) = "offTurnoverRating"
    teamFieldIds$(7) = "defTurnoverAdj"
    teamFieldIds$(8) = "defFoulAdj"
    teamFieldIds$(9) = "ifUsing99"
    teamFieldIds$(10) = "textColor"
    teamFieldIds$(11) = "backgroundColor"
    teamFieldIds$(12) = "twelve"  ' no earthly clue what this is, usually always 999
    teamFieldIds$(13) = "teamFGAPerG"
    teamFieldIds$(14) = "leagueFGAPerG"
    teamFieldIds$(15) = "teamGamesPlayed"
    teamFieldIds$(16) = "homecourtFactor"
    teamFieldIds$(17) = "wins"
    teamFieldIds$(18) = "losses"
    teamFieldIds$(19) = "powerRating"
    teamFieldIds$(20) = "coach"
    teamFieldIds$(21) = "arena"
    teamFieldIds$(22) = "nickname"
    teamFieldIds$(23) = "attendance"
End Sub

' =====================================================================================================================
' Sets the player field index to string mappimgs
Sub SetPlayerFieldIds
    playerFieldIds$(1) = "adjFgPct"
    playerFieldIds$(2) = "ftPct"
    playerFieldIds$(3) = "defReb40Minx10"
    playerFieldIds$(4) = "contribPct"
    playerFieldIds$(5) = "assistRating"
    playerFieldIds$(6) = "stealRating"
    playerFieldIds$(7) = "blockRating"
    playerFieldIds$(8) = "gamesPlayed"
    playerFieldIds$(9) = "fgAtt"
    playerFieldIds$(10) = "fg3Pct"
    playerFieldIds$(11) = "fg3OfTotalFgAtt"
    playerFieldIds$(12) = "offReb40Minx10"
    playerFieldIds$(13) = "foulCommitRating"
    playerFieldIds$(14) = "foulDrawRating"
End Sub

' =====================================================================================================================
' Writes data for a single team to the output JSON
Sub WriteOneTeam (teamIdx)
    WriteToFile "   " + CHR$(34) + RTrim$(teamData$(teamIdx, 0)) + CHR$(34) + ": {"

    WriteToFile "      " + CHR$(34) + "name" + CHR$(34) + ": " + CHR$(34) + RTrim$(teamData$(teamIdx, 0)) + CHR$(34) + ","
    WriteToFile "      " + CHR$(34) + "year" + CHR$(34) + ": " + COMMAND$ + ","
    WriteToFile "      " + CHR$(34) + "isWomen" + CHR$(34) + ": false,"
    For teamDataIdx = 1 To 19
        value$ = STR$(CVI(teamData$(teamIdx, teamDataIdx)))
        WriteToFile "      " + CHR$(34) + teamFieldIds$(teamDataIdx) + CHR$(34) + ": " + value$ + ","
    Next teamDataIdx
    For teamDataIdx = 20 To 22
        value$ = RTrim$(teamData$(teamIdx, teamDataIdx))
        WriteToFile "      " + CHR$(34) + teamFieldIds$(teamDataIdx) + CHR$(34) + ": " + CHR$(34) + value$ + CHR$(34) + ","
    Next teamDataIdx

    ' Attendance is a long (CVL)
    value$ = STR$(CVL(teamData$(teamIdx, 23)))
    WriteToFile "      " + CHR$(34) + teamFieldIds$(23) + CHR$(34) + ": " + value$ + ","

    WriteToFile "      " + CHR$(34) + "players" + CHR$(34) + ": ["
    For playerIdx = 0 To 13
        WriteToFile "         {"
        WriteToFile "            " + CHR$(34) + "name" + CHR$(34) + ": " + CHR$(34) + RTrim$(playerData$(teamIdx, playerIdx, 0)) + CHR$(34) + ","
        For fieldIdx = 1 To 14
            value$ = STR$(CVI(playerData$(teamIdx, playerIdx, fieldIdx)))
            If fieldIdx < 14 Then
                WriteToFile "            " + CHR$(34) + playerFieldIds$(fieldIdx) + CHR$(34) + ": " + value$ + ","
            Else
                WriteToFile "            " + CHR$(34) + playerFieldIds$(fieldIdx) + CHR$(34) + ": " + value$
            End If
        Next fieldIdx

        If playerIdx < 13 Then 
            WriteToFile "         },"
        Else 
            WriteToFile "         }"
        End If
    Next playerIdx
    WriteToFile "      ]"

    WriteToFile "   }"
End Sub

' =====================================================================================================================
' Outputs the data arrays into a JSON formatted output file.
Sub WriteOutputFile
    Shared numberTeams 

    ' Open the output file (will be named TeamData.<year>.json)
    OpenOutputFile

    ' Initialize field names arrays
    SetTeamFieldIds
    SetPlayerFieldIds

    ' Write the team data (temporary)
    WriteToFile "{"
    For teamIdx = 1 to numberTeams 
        WriteOneTeam(teamIdx)
        If teamIdx < numberTeams Then
            WriteToFile ","
        End If
    Next teamIdx
    WriteToFile "}"

    ' Close the output file
    CloseOutputFile
End Sub 

' =====================================================================================================================
' Reads the COLBBTMS.<year> file, which has some extra data (coach, nickname, etc). This is all combined.
Sub ReadExtrasFile
    Shared numberTeams

    ' Team extras data (ED)
    Dim TD$(5)

    extrasFileName$ = "COLBBTMS." + COMMAND$

    ' Opens COLBBTMS (extras) file for random access, sets record length (DATA_SIZE_BYTES)
    Open extrasFileName$ For Random as #1 Len = DATA_SIZE_BYTES

    ' Reads record data into the array
    Field #1, 15 As TD$(0), 40 As TD$(1), 15 As TD$(2), 4 As TD$(3)

    For teamIdx = 1 To numberTeams
        Get #1, teamIdx

        For teamDataIdx = 0 To 3
            teamData$(teamIdx, teamDataIdx + 20) = TD$(teamDataIdx)
        Next teamDataIdx
    Next teamIdx

    Close #1
End Sub

' =====================================================================================================================
' Reads the BASK.<year> file, which has the team data. Output JSON uses those as the object indices.
Sub ReadTeamFile
    Shared numberTeams

    ' Team data (TD) and player data (PD) arrays
    Dim TD$(20)
    Dim PD$(15,15)

    baskFileName$ = "BASK." + COMMAND$

    ' Opens BASK (teams) file for random access, sets record length (TEAM_SIZE_BYTES)
    Open baskFileName$ For Random as #1 Len = TEAM_SIZE_BYTES

    ' Stores how long the file is (number of bytes)
    fileLength& = LOF(1)

    ' Reads the team-wide data into TD array (X$ is just a "throwaway" variable)
    Field #1, 15 As TD$(0), 2 As TD$(1), 2 As TD$(2), 2 As TD$(3), 2 As TD$(4), 2 As TD$(5), 2 As TD$(6), _ 
        2 As TD$(7), 2 As TD$(8), 2 As TD$(9), 2 As TD$(10), 2 As TD$(11), 2 As TD$(12), 2 As TD$(13), _ 
        2 As TD$(14), 2 As TD$(15), 2 As TD$(16), 2 As TD$(17), 2 As TD$(18), 2 As TD$(19), 602 As X$

    ' Reads the data for each individual player
    For I = 0 To 13
        Field #1, 53 + I * 43 As X$, 15 As PD$(I,0), 2 As PD$(I,1), 2 As PD$(I,2), 2 As PD$(I,3), 2 As PD$(I,4), _ 
            2 As PD$(I,5), 2 As PD$(I,6), 2 As PD$(I,7), 2 As PD$(I,8), 2 As PD$(I,9), 2 As PD$(I,10), _ 
            2 As PD$(I,11), 2 As PD$(I,12), 2 As PD$(I,13), 2 As PD$(I,14), TEAM_SIZE_BYTES - 53 - 43 - I * 43 As X$
    Next

    ' To find number of teams, take file size in bytes and divide by size of each record (1 record = 1 team in this case)
    numberTeams = fileLength& / TEAM_SIZE_BYTES

    ' Loops through each team record, pulling the team data out and assigning it to array
    For teamIdx = 1 To numberTeams
        Get #1, teamIdx

        ' Team-wide data
        For teamDataIdx = 0 To 19
            teamData$(teamIdx, teamDataIdx) = TD$(teamDataIdx)
        Next teamDataIdx

        ' Player data
        For playerIdx = 0 To 13
            For fieldIdx = 0 To 14
                playerData$(teamIdx, playerIdx, fieldIdx) = PD$(playerIdx, fieldIdx)
            Next fieldIdx
        Next playerIdx
    Next teamIdx

    Close #1
End Sub

' =====================================================================================================================
' Clear any existing output file, then open for append writing
Sub OpenOutputFile
    outputFileName$ = "TeamData." + COMMAND$ + ".json"

    ' Clear any existing file with this name
    Open outputFileName$ for OUTPUT AS #2
    Close #2

    ' Open for append
    Open outputFileName$ for APPEND AS #2
End Sub

' =====================================================================================================================
' Write text to the output file, inserts newline after each call
Sub WriteToFile (text$)
    Print #2, text$
End Sub

' =====================================================================================================================
' Close the output file
Sub CloseOutputFile
    Close #2
End Sub
