rem Create a timestamp with date and time, replacing ' ' with '0', '/' with '-' and ':' with '-'
set atlassian_timestamp=%DATE:~-4%.%DATE:~4,2%.%DATE:~7,2%_%TIME:~0,2%.%TIME:~3,2%.%TIME:~6,2%
echo %atlassian_timestamp%
set atlassian_timestamp=%atlassian_timestamp: =0%
set atlassian_timestamp=%atlassian_timestamp:/=-%
set atlassian_timestamp=%atlassian_timestamp::=-%
echo %atlassian_timestamp%

rem Calculate offset to ..\logs directory
set atlassian_logsdir=%~dp0..\logs

rem Set the JVM arguments used to start Confluence. For a description of the options, see
rem http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html
set CATALINA_OPTS=-XX:-PrintGCDetails -XX:+PrintGCDateStamps -XX:-PrintTenuringDistribution %CATALINA_OPTS%
set CATALINA_OPTS=-XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=5 -XX:GCLogFileSize=2M %CATALINA_OPTS%
set CATALINA_OPTS=-Xloggc:"%atlassian_logsdir%\gc-%atlassian_timestamp%.log" %CATALINA_OPTS%
set CATALINA_OPTS=-Djava.awt.headless=true %CATALINA_OPTS%
set CATALINA_OPTS=-Datlassian.plugins.enable.wait=300 %CATALINA_OPTS%
set CATALINA_OPTS=-Xms1024m -Xmx1024m -XX:+UseG1GC %CATALINA_OPTS%


rem Clean up temporary variables
set atlassian_logsdir=
set atlassian_timestamp=


rem Checks if the JAVA_HOME has a space in it (can cause issues)
SET _marker=%JAVA_HOME: =%
IF NOT "%_marker%" == "%JAVA_HOME%" ECHO JAVA_HOME "%JAVA_HOME%" contains spaces. Please change to a location without spaces if this causes problems.

echo If you encounter issues starting up Confluence, please see the Installation guide at http://confluence.atlassian.com/display/DOC/Confluence+Installation+Guide
SET "JRE_HOME=/opt/atlassian/confluence\jre"