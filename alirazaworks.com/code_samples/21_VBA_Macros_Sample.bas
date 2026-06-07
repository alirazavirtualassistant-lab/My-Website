' =====================================================================
' VBA Macros Portfolio — Ali Raza
' File: 21_VBA_Macros_Sample.bas
' Description: Reusable macros for weekly sales report automation.
'   1. ConsolidateRegionalCSVs       - reads CSVs from a folder
'   2. RefreshAllPivotsAndCharts     - refreshes everything
'   3. AutoFormatSalesReport         - applies house style
'   4. EmailReportToManager          - sends via Outlook
'   5. ProtectFinalSheets            - locks down the deliverable
' =====================================================================

Option Explicit

' ---------------------------------------------------------------------
' 1. Consolidate every CSV in a folder into a single sheet
' ---------------------------------------------------------------------
Public Sub ConsolidateRegionalCSVs()
    Dim folderPath As String
    Dim fName As String
    Dim wbSrc As Workbook
    Dim wsTarget As Worksheet
    Dim lastRowSrc As Long, lastRowTgt As Long

    folderPath = ThisWorkbook.Path & "\regional_csvs\"
    If Right$(folderPath, 1) <> "\" Then folderPath = folderPath & "\"

    Set wsTarget = ThisWorkbook.Sheets("RawData")
    wsTarget.UsedRange.ClearContents
    wsTarget.Range("A1").Value = "Region"
    wsTarget.Range("B1").Resize(1, 6).Value = _
        Array("OrderID", "Date", "Customer", "Product", "Qty", "Amount")

    Application.ScreenUpdating = False
    fName = Dir(folderPath & "*.csv")

    Do While fName <> ""
        Set wbSrc = Workbooks.Open(folderPath & fName, ReadOnly:=True)
        With wbSrc.Sheets(1)
            lastRowSrc = .Cells(.Rows.Count, "A").End(xlUp).Row
            If lastRowSrc > 1 Then
                lastRowTgt = wsTarget.Cells(wsTarget.Rows.Count, "A").End(xlUp).Row + 1
                wsTarget.Range("A" & lastRowTgt).Resize(lastRowSrc - 1, 1).Value = Replace(fName, ".csv", "")
                wsTarget.Range("B" & lastRowTgt).Resize(lastRowSrc - 1, 6).Value = _
                    .Range("A2:F" & lastRowSrc).Value
            End If
        End With
        wbSrc.Close SaveChanges:=False
        fName = Dir
    Loop

    Application.ScreenUpdating = True
    MsgBox "Consolidation complete.", vbInformation
End Sub

' ---------------------------------------------------------------------
' 2. Refresh every pivot table and chart in the workbook
' ---------------------------------------------------------------------
Public Sub RefreshAllPivotsAndCharts()
    Dim ws As Worksheet
    Dim pt As PivotTable
    Dim ch As ChartObject

    Application.Calculation = xlCalculationAutomatic
    ThisWorkbook.RefreshAll

    For Each ws In ThisWorkbook.Worksheets
        For Each pt In ws.PivotTables
            pt.RefreshTable
        Next pt
        For Each ch In ws.ChartObjects
            ch.Chart.Refresh
        Next ch
    Next ws
End Sub

' ---------------------------------------------------------------------
' 3. Apply consistent formatting to the final report sheet
' ---------------------------------------------------------------------
Public Sub AutoFormatSalesReport()
    Dim ws As Worksheet
    Set ws = ThisWorkbook.Sheets("Report")

    With ws.Rows(1)
        .Font.Bold = True
        .Font.Color = RGB(255, 255, 255)
        .Interior.Color = RGB(31, 58, 104)   ' Navy header
        .HorizontalAlignment = xlCenter
        .RowHeight = 22
    End With

    ws.UsedRange.Borders.LineStyle = xlContinuous
    ws.UsedRange.Borders.Color = RGB(204, 204, 204)
    ws.Columns.AutoFit

    With ws.Range("F2:F" & ws.Cells(ws.Rows.Count, "F").End(xlUp).Row)
        .NumberFormat = "$#,##0.00"
    End With

    ws.Range("A1").AutoFilter
End Sub

' ---------------------------------------------------------------------
' 4. Email the workbook to the manager via Outlook
' ---------------------------------------------------------------------
Public Sub EmailReportToManager()
    Dim olApp As Object
    Dim olMail As Object
    Dim attachPath As String

    attachPath = ThisWorkbook.FullName

    Set olApp = CreateObject("Outlook.Application")
    Set olMail = olApp.CreateItem(0)

    With olMail
        .To = "manager@company.com"
        .Subject = "Weekly Sales Report — " & Format(Date, "dd-mmm-yyyy")
        .Body = "Hi," & vbCrLf & vbCrLf & _
                "Please find attached this week's sales report. Highlights are on the Dashboard tab." & _
                vbCrLf & vbCrLf & "Best," & vbCrLf & "Ali"
        .Attachments.Add attachPath
        .Display          ' use .Send to send without preview
    End With
End Sub

' ---------------------------------------------------------------------
' 5. Protect every sheet that should not be edited downstream
' ---------------------------------------------------------------------
Public Sub ProtectFinalSheets()
    Const PROTECT_PASSWORD As String = "report2026"
    Dim ws As Worksheet
    Dim protectThese As Variant
    Dim i As Long

    protectThese = Array("Dashboard", "Report")

    For Each ws In ThisWorkbook.Worksheets
        For i = LBound(protectThese) To UBound(protectThese)
            If StrComp(ws.Name, protectThese(i), vbTextCompare) = 0 Then
                ws.Protect Password:=PROTECT_PASSWORD, _
                           AllowFiltering:=True, AllowSorting:=True
            End If
        Next i
    Next ws
End Sub

' ---------------------------------------------------------------------
' Master macro — runs the full pipeline in order
' ---------------------------------------------------------------------
Public Sub RunFullWeeklyPipeline()
    Call ConsolidateRegionalCSVs
    Call RefreshAllPivotsAndCharts
    Call AutoFormatSalesReport
    Call ProtectFinalSheets
    MsgBox "Weekly pipeline complete. Ready to email.", vbInformation
End Sub
